/* eslint-disable @typescript-eslint/no-explicit-any */
import { entities } from '$db/entities';
import { Remult, repo, type ClassType } from 'remult';
import { createSubscriber } from 'svelte/reactivity';

export function initRemult() {
  Remult.entityRefInit = (x) => {
    let update = () => {};
    const s = createSubscriber((u) => {
      update = u;
    });
    x.subscribe({
      reportObserved: () => s(),
      reportChanged: () => update()
    });
  };
}

export const remultTransport = {
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
};
