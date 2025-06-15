import service from '@/api/service';
import config from '@/api/config';
import axios from "axios";

interface WebrtcPlayerOptions {
  serverIp: string;
  domain: string;
  app: string;
  stream: string;
  config?: RTCConfiguration;
}

export default class WebrtcPlayer {
  private options!: WebrtcPlayerOptions;
  private videoElement: HTMLVideoElement | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private remoteStream: MediaStream | null = null;
  private etag: string;

  init(options: WebrtcPlayerOptions): void {
    this.options = {
      ...options,
      config: {
        iceServers: [
          { urls: `stun:${options.serverIp}:3478` }
        ],
      }
    };
  }

  setVideoElement(videoEl: HTMLVideoElement): void {
    this.videoElement = videoEl;
  }

  async play(params: Record<string, any>): Promise<boolean> {
    const url = `http://${this.options.serverIp}/${this.options.app}/${this.options.stream}.whep?domain=${this.options.domain}`;
    const headers = {
        Accept: 'application/sdp',
        Connection: 'close'
    };
    try {
        const response = await axios.post(url, params, { headers });

        const rawSdp = response.data;
        console.log(response.headers);
        const etag = response.headers['etag']; // 注意 header 名字是小写

        console.log("rawSdp:", rawSdp);
        console.log("ETag:", etag);

        if (!rawSdp) {
            console.error('服务端未返回 SDP');
            return false;
        }

        this.etag = etag;
        // 构造 RTCSessionDescriptionInit 类型的对象
        let play_sdp: RTCSessionDescriptionInit;
        if (typeof rawSdp === 'string') {
            // 如果服务端返回纯 SDP 字符串
            play_sdp = {
                type: 'offer',
                sdp: rawSdp
            };
        } else if (typeof rawSdp === 'object' && rawSdp !== null && 'sdp' in rawSdp && 'type' in rawSdp) {
            // 明确提取字段构造对象，而不是直接断言
            play_sdp = {
                type: rawSdp.type as RTCSdpType,
                sdp: rawSdp.sdp as string
            };
        } else {
            console.error('返回的 SDP 格式无效:', rawSdp);
            return false;
        }


        this.peerConnection = new RTCPeerConnection(this.options.config);

        this.peerConnection.addEventListener('icecandidate', this.handleIceCandidate.bind(this));
        this.peerConnection.addEventListener('iceconnectionstatechange', this.handleIceConnectionStateChange.bind(this));
        this.peerConnection.addEventListener('track', this.gotRemoteMediaStream.bind(this));

        try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(play_sdp));
            console.log('设置远端 offer 成功');

            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            console.log('设置本地 answer 成功:', answer.sdp);
            const url = `http://${this.options.serverIp}/${this.options.app}/${this.options.stream}.whep?domain=${this.options.domain}`;
            const headers1 = {
                Accept: 'application/sdp',
                'If-Match': this.etag,
                Connection: 'close'
            };
            
            await service.patch(url, answer.sdp, headers1);
            return true;
        } catch (err) {
            console.error('WebRTC SDP 信令交换失败:', err);
            return false;
        }
    } catch (error) {
        console.error("请求失败:", error);
    }

    
  }

  private handleIceCandidate(event: RTCPeerConnectionIceEvent): void {
    console.log('ICE Candidate:', event.candidate);
    // 你可以在这里将 candidate 发送到服务端
  }

  private handleIceConnectionStateChange(): void {
    if (this.peerConnection) {
      console.log('ICE 状态变化:', this.peerConnection.iceConnectionState);
    }
  }

  private gotRemoteMediaStream(event: RTCTrackEvent): void {
    console.log('收到远端媒体流:', event);
    if (event.track.kind === 'video' && this.videoElement) {
      this.remoteStream = event.streams[0];
      this.videoElement.srcObject = this.remoteStream;
    }
  }

  disconnect(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.videoElement = null;
    this.remoteStream = null;
  }

  get isConnected(): boolean {
    return !!this.peerConnection && this.peerConnection.connectionState === 'connected';
  }
}
