import { applyAction } from '$app/forms';
import type { ActionResult } from '@sveltejs/kit';

type Update = (options?: {
  reset?: boolean;
  invalidateAll?: boolean;
}) => Promise<void>;
type Result = ActionResult;

export class NiceForm {
  isLoading = $state(false);
  onSuccess: (() => void) | undefined;

  constructor({ onSuccess }: { onSuccess?: () => void }) {
    this.onSuccess = onSuccess;
  }

  enhance() {
    this.isLoading = true;

    return async ({ result, update }: { result: Result; update: Update }) => {
      await applyAction(result);
      await update();

      this.isLoading = false;

      this.onSuccess?.();
    };
  }
}
