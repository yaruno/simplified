import { Stream, StreamrClient } from 'streamr-client';
import { Listener } from './Listener';

export class Validator {

  private readonly listener: Listener;

  constructor(
    private readonly client: StreamrClient,
    private readonly stream: Stream
  ) {
    this.listener = new Listener(this.client, this.stream);
  }

  public async start() {
    await this.listener.start();
  }

  public async stop() {
    await this.listener.stop();
  }
}
