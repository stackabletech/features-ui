import type {EndpointOutput, Request} from '@sveltejs/kit';
import type {Locals} from '$lib/types';
import {PrismaClient, Product} from '@prisma/client';

const prisma = new PrismaClient();

export async function api(request: Request<Locals>, resource: string, data?: Product): Promise<EndpointOutput> {

  // if the request came from a <form> submission, the browser's default
  // behaviour is to show the URL corresponding to the form's "action"
  // attribute. in those cases, we want to redirect them back to the
  // /todos page, rather than showing the response
  if (request.method !== 'GET' && request.headers.accept !== 'application/json') {
    return {
      status: 303, headers: {
        location: '/product_features'
      }
    };
  }

  let body = {};
  let status = 500;
  switch (request.method.toUpperCase()) {
    case "DELETE":
      /*
      await prisma.productFeature.delete({
        where: {
          id: parseInt(resource)
        }
      });

       */
      status = 200;
      break;
    case "GET":
      body = await prisma.productFeature.findMany({
        include: {
          features: true
        }
      });
      status = 200;
      break;
    case "PATCH":
      /*
      body = await prisma.productFeature.update({
        data: {
          name: data.name,
        }, where: {
          id: data.id
        }
      });

       */
      status = 200;
      break;
    case "POST":
      /*
            body = await prisma.productFeature.create({
              data: {
                name: data.name
              }
            });
        */
      status = 201;
      break;
  }

  return {
    status, body
  };
}
