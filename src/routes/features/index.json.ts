import {api} from './_api';
import type {RequestHandler} from '@sveltejs/kit';
import type {Locals} from '$lib/types';

// GET /features.json
export const get: RequestHandler<Locals> = async (request) => {
  const response = await api(request, `features`);

  if (response.status === 404) {
    // start with an empty array
    return {body: []};
  }

  return response;
};

// POST /features.json
export const post: RequestHandler<Locals, FormData> = async (request) => {
  const response = await api(request, `features`, {
    // because index.svelte posts a FormData object,
    // request.body is _also_ a (readonly) FormData
    // object, which allows us to get form data
    // with the `body.get(key)` method
    id: 1, name: request.body.get('name')
  });

  return response;
};
