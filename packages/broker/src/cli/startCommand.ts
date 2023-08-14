import { CreateClientOptions, createClient } from '@simplified/shared';
import { Logger } from '@streamr/utils';
import { Command } from 'commander';
import { Broker } from '../Broker';
import { devNetworkOption, externalIpOption, privateKeyOption, streamIdOption } from './options';

const logger = new Logger(module);

interface Options {
	devNetwork: boolean;
	externalIp: string;
	privateKey: string;
	streamId: string;
}

export const startCommand = new Command('start')
	.description('Start Broker')
	.addOption(devNetworkOption)
	.addOption(externalIpOption)
	.addOption(privateKeyOption)
	.addOption(streamIdOption)
	.action(async (options: Options) => {
		logger.info('Starting Broker...');

		const createClientOptions: CreateClientOptions = {
			devNetwork: options.devNetwork,
			externalIp: options.externalIp,
		}

		const client = await createClient(options.privateKey, createClientOptions);
		const stream = await client.getStream(options.streamId);

		const broker = new Broker(client, stream);
		await broker.start();
		logger.info('Broker started');
	});
