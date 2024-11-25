import Link from "next/link";

const MenuButton = (props: any) => {
  const { children, href, className, active } = props;

  return (
    <Link
      href={href}
      className={`${className} h-fit text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.7)] ${
        active ? "text-[#000000]" : ""
      } active:text-[#000000] px-4 xl:px-8 py-3`}
    >
      {children}
    </Link>
  );
};

const FooterButton = (props: any) => {
  const { children, href, className, active } = props;

  return (
    <Link
      href={href}
      className={`${className}  h-fit hover:text-primary active:bg-primary-200 px-4 xl:px-8 py-3`}
    >
      {children}
    </Link>
  );
};

export { MenuButton, FooterButton };
