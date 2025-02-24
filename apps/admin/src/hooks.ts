/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Transport } from '@sveltejs/kit';
import { entities } from '$db/entities';
import { repo, type ClassType } from 'remult';

export const transport: Transport = {
  // encode and decode remult data
  remultTransport: {
    encode: (value: any) => {
      for (let index = 0; index < entities.length; index++) {
        const element = entities[index] as ClassType<any>;
        if (value instanceof element) {
          return {
            ...repo(element).toJson(value),
            entity_key: repo(element).metadata.key
          };
        }
      }
    },
    decode: (value: any) => {
      for (let index = 0; index < entities.length; index++) {
        const element = entities[index] as ClassType<any>;
        if (value.entity_key === repo(element).metadata.key) {
          return repo(element).fromJson(value);
        }
      }
    }
  }
};
