import { CreateClientOptions, createClient } from '@simplified/shared';
import { Logger } from '@streamr/utils';
import { Command } from 'commander';
import { Validator } from '../Validator';
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
		logger.info('Starting Validator...');

		const createClientOptions: CreateClientOptions = {
			devNetwork: options.devNetwork,
			externalIp: options.externalIp,
		}

		const client = await createClient(options.privateKey, createClientOptions);
		const stream = await client.getStream(options.streamId);

		setInterval(async () => {
			const info = await client.getDiagnosticInfo()
			console.log(JSON.stringify(info))
		}, 10 * 1000) // every 10 sec

		const validator = new Validator(client, stream);
		await validator.start();
	});
