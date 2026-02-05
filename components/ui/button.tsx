'use client';

import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { Button as ButtonPrimitive } from '@base-ui/react/button';

import { buttonVariants } from '@/components/ui/button-variants';

function Button({
  className,
  variant = 'default',
  size = 'lg',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        'touch-hitbox cursor-pointer text-base shadow-md transition-all duration-150 ease-in-out active:scale-95 active:shadow-none',
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
