import Link from 'next/link';
import Logo from '../Logo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button, buttonVariants } from '../ui/button';
import { Github, SendHorizonal } from 'lucide-react';
import { siteConfig } from '@config/site';
import Theme from '@components/Theme';

const Footer = () => {
    return (
        <footer className="w-full border-t bg-background z-50 relative">
            <div className="container py-8 flex flex-col gap-10 bg-background">
                <div className="lg:flex justify-between space-y-10 lg:space-y-0">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 lg:flex w-full justify-evenly">
                        {siteConfig.footerNav.map((component) => (
                            <div
                                key={component.title}
                                className="space-y-2"
                            >
                                <span className="font-bold text-lg">{component.title}</span>
                                <ul className=" text-muted-foreground flex flex-col gap-4">
                                    {component.items.map((item) => (
                                        <li key={item.title}>
                                            <Link
                                                href={item.href}
                                                className="hover:text-primary transition"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="min-w-fit">
                        <Label
                            htmlFor="newsletter"
                            className="font-semibold text-lg"
                        >
                            Subscribe to our newsletter
                        </Label>
                        <div className="flex my-3 items-center gap-2">
                            <Input
                                type="email"
                                id="newsletter"
                                placeholder="thrift@gmail.com"
                                className="h-10"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="h-10"
                                aria-label="Submit Subscribe"
                            >
                                <SendHorizonal className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between">
                    <p className="text-muted-foreground">
                        Build by <span className="font-semibold">Farhan</span>.
                    </p>
                    <div className="flex gap-5">
                        <Link
                            className={buttonVariants({
                                size: 'icon',
                            })}
                            href="https://github.com/Frhaanaziz/thriftshop"
                            target="_blank"
                        >
                            <Github className="w-5 h-5" />
                        </Link>

                        <Theme />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
