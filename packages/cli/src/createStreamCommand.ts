import { CreateClientOptions, createClient } from '@simplified/shared';
import { Logger } from '@streamr/utils';
import { Command } from 'commander';
import { StreamPermission } from 'streamr-client';
import { devNetworkOption, privateKeyOption, streamIdOption } from './options';

const logger = new Logger(module);

interface Options {
	devNetwork: boolean;
	privateKey: string;
	streamId: string;
}

export const createStreamCommand = new Command('create-stream')
	.description('Create Stream')
	.addOption(devNetworkOption)
	.addOption(privateKeyOption)
	.addOption(streamIdOption)
	.action(async (options: Options) => {
		logger.info('Creating Stream...');

		const createClientOptions: CreateClientOptions = {
			devNetwork: options.devNetwork
		}

		const client = await createClient(options.privateKey, createClientOptions);
		const stream = await client.getOrCreateStream({
			id: `/${options.streamId}`,
		});

		await stream.grantPermissions({
			public: true,
			permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
		});

		logger.info(`Created Stream ${stream.id}`);
	});
