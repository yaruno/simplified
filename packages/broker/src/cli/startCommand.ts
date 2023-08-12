import { createClient } from '@simplified/shared';
import { Logger } from '@streamr/utils';
import { Command } from 'commander';
import { Broker } from '../Broker';
import { devNetworkOption, privateKeyOption, streamIdOption } from './options';

const logger = new Logger(module);

interface Options {
	devNetwork: boolean;
	privateKey: string;
	streamId: string;
}

export const startCommand = new Command('start')
	.description('Start Broker')
	.addOption(devNetworkOption)
	.addOption(privateKeyOption)
	.addOption(streamIdOption)
	.action(async (options: Options) => {
		logger.info('Starting Broker...');
		const client = createClient(options.privateKey, options.devNetwork);
		const stream = await client.getStream(options.streamId);

		const broker = new Broker(client, stream);
		await broker.start();
		logger.info('Broker started');
	});
