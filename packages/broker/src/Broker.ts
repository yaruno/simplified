import { StreamPublisher } from '@simplified/shared';
import { Logger } from '@streamr/utils';
import { Stream, StreamrClient } from 'streamr-client';
import { v4 as uuid } from 'uuid';
import { Cache } from './Cache';
import { Recovery } from './Recovery';
import { Sensor } from './Sensor';

const logger = new Logger(module);

export class Broker {

  private readonly streamPublisher: StreamPublisher;
  private readonly sensor: Sensor;
  private readonly cache: Cache;
  private readonly recovery: Recovery;

  constructor(
    private readonly client: StreamrClient,
    private readonly stream: Stream,
  ) {
    this.streamPublisher = new StreamPublisher(
      this.client,
      this.stream
    );
    this.sensor = new Sensor(uuid(), this.streamPublisher);
    this.cache = new Cache(this.client, this.stream);
    this.recovery = new Recovery(this.client, this.stream, this.streamPublisher, this.cache);

    this.cache.on('full', () => Promise.all([
      this.cache.stop(),
      this.sensor.stop(),
    ]));
  }

  public async start() {
    await Promise.all([
      this.sensor.start(),
      this.cache.start(),
      this.recovery.start(),
    ]);
  }

  public async stop() {
    await Promise.all([
      this.recovery.stop(),
      this.cache.stop(),
      this.sensor.stop(),
    ]);
  }
}
