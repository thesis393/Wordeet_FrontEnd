import Image from "next/image";
import Link from "next/link"

interface ISocialLink {
  href: string;
  className?: string;
  icon?: string;
  alt?: string;
}

const SocialLink = (props: ISocialLink) => {
  const { href, className, icon, alt = "socialF" } = props
  return (
    <Link href={href} className={`${className} rounded-lg bg-dark hover:bg-dark-200 active:bg-dark-100 hover:scale-101 active:scale-99 p-4`}>
      {icon && <Image src={icon} width={25} height={25} alt={alt} />}
    </Link>
  )
} 

export default SocialLink