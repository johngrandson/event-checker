import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Meteor } from 'meteor/meteor';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UseCheckingOptions {
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Executes a Meteor server method call asynchronously.
 *
 * @template TArgs - The type of arguments passed to the Meteor method.
 * @template TResult - The expected result type from the Meteor method.
 *
 * @param {string} methodName - The name of the Meteor method to be called.
 * @param {TArgs} args - An array of arguments to pass to the method.
 * @param {UseCheckingOptions} [options] - Optional settings for success and error messages.
 *
 * @returns {Promise<TResult>} A promise that resolves with the result of the method call.
 *
 * @throws Will throw an error if the Meteor method call fails.
 */
export const executeMeteorCall = async <TArgs extends unknown[], TResult>(
  methodName: string,
  args: TArgs,
  options?: UseCheckingOptions
): Promise<TResult> => {
  try {
    const result: TResult = await new Promise((resolve, reject) => {
      Meteor.call(methodName, ...args, (error: Meteor.Error, res: TResult) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      });
    });

    if (options?.successMessage) {
      toast.success(options?.successMessage);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toast.error(errorMessage || options?.errorMessage || 'An error occurred');
    throw error;
  }
};
