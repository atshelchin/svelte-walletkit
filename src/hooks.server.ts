import type { Handle } from '@sveltejs/kit';
// @ts-expect-error - paraglide server module may not exist yet
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(
		event.request,
		({ request, locale }: { request: Request; locale: string }) => {
			event.request = request;

			return resolve(event, {
				transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
			});
		}
	);

export const handle: Handle = handleParaglide;
