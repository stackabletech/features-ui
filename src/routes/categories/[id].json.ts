import {api} from './_api';
import type {RequestHandler} from '@sveltejs/kit';
import type {Locals} from '$lib/types';

// PATCH /categories/:uid.json
export const patch: RequestHandler<Locals, FormData> = async (request) => {
  return api(request, `categories/${request.params.uid}`, {
    id: request.params.uid, name: request.body.get('name'),
  });
};

// DELETE /categories/:uid.json
export const del: RequestHandler<Locals> = async (request) => {
  return api(request, `categories/${request.params.uid}`);
};

// GET /categories/:id.json
export const get: RequestHandler<Locals> = async (request) => {
  return api(request, `categories/${request.params.id}`);
};
