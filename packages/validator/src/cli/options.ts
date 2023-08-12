import { Option } from 'commander';

export const devNetworkOption = new Option(
	'--dev-network',
	'Connect to DevNetwork'
)
	.env('DEV_NETWORK')
	.default(false);

export const privateKeyOption = new Option(
	'--private-key <private_key>',
	'Private Key'
)
	.env('PRIVATE_KEY')
	.makeOptionMandatory();

export const streamIdOption = new Option(
	'--stream-id <stream-id>',
	'Stream ID'
)
	.env('STREAM_ID')
	.makeOptionMandatory();
