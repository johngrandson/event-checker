import React, { ForwardRefExoticComponent } from 'react';
import { LucideProps } from 'lucide-react';

import { Button } from '/components/ui/button';

type ActionButtonProps = {
  variant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'success';
  onClick?: () => void;
  text: string;
  Icon: ForwardRefExoticComponent<LucideProps>;
  disabled?: boolean;
  iconClassName?: string;
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  onClick,
  text,
  Icon,
  disabled = false,
  iconClassName = '',
}) => (
  <Button
    variant={variant}
    className="flex h-8 w-auto items-center justify-between px-3"
    onClick={onClick}
    disabled={disabled}
  >
    <span>{text}</span>
    <Icon size={15} className={`ml-2 ${iconClassName}`} />
  </Button>
);
