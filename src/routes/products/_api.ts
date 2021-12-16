import type {EndpointOutput, Request} from '@sveltejs/kit';
import type {Locals} from '$lib/types';
import prisma from '$lib/prisma';
import type {Product} from '@prisma/client';

export async function api(request: Request<Locals>, resource: number, data?: Product): Promise<EndpointOutput> {

  let body = {};
  let status = 500;
  switch (request.method.toUpperCase()) {
    case "DELETE":
      await prisma.product.delete({
        where: {
          id: parseInt(resource)
        }
      });
      status = 200;
      break;
    case "GET":
      body = await prisma.product.findMany();
      status = 200;
      break;
    case "PATCH":
      body = await prisma.product.update({
        data: {
          name: data.name,
        }, where: {
          id: data.id
        }
      });
      console.log(body);
      status = 200;
      break;
    case "POST":
      body = await prisma.product.create({
        data: {
          name: data.name
        }
      });
      status = 201;
      break;
  }

  // if the request came from a <form> submission, the browser's default
  // behaviour is to show the URL corresponding to the form's "action"
  // attribute. in those cases, we want to redirect them back to the
  // /todos page, rather than showing the response
  if (request.method !== 'GET' && request.headers.accept !== 'application/json') {
    return {
      status: 303, headers: {
        location: '/products'
      }
    };
  }

  return {
    status, body
  };
}
