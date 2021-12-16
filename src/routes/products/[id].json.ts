import {api} from './_api';
import type {RequestHandler} from '@sveltejs/kit';
import type {Locals} from '$lib/types';

// PATCH /products/:id.json
export const patch: RequestHandler<Locals, FormData> = async (request) => {
  console.log("Patching" + request.params.id + " - " + request.body.get('name'));
  return api(request, Number(request.params.id), {
    id: parseInt(request.params.id), name: request.body.get('name'),
  });
};

// DELETE /products/:id.json
export const del: RequestHandler<Locals> = async (request) => {
  console.log(`delete request ${request.params.id}`)
  return api(request, parseInt(request.params.id));
};

// GET /products/:id.json
export const get: RequestHandler<Locals> = async (request) => {
  // TODO
};

