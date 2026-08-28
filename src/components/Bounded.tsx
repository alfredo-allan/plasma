import { CSSProperties, ElementType, ReactNode } from "react";
import clsx from "clsx";

type BoundedProps = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Bounded({
  as: Comp = "section",
  className,
  children,
  ...restProps
}: BoundedProps) {
  // O React 19 estável ficou mais rígido ao tipar componente polimórfico
  // genérico (ElementType) com JSX, o que quebra esse padrão "as" mesmo
  // sem nenhuma mudança de comportamento real. O cast abaixo é o jeito
  // padrão de contornar isso sem perder a flexibilidade de trocar a tag.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Comp as any;

  return (
    <Component
      className={clsx(
        "px-6 ~py-10/16 [.header+&]:pt-44 [.header+&]:md:pt-32",
        className
      )}
      {...restProps}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </Component>
  );
}
