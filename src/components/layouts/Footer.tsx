import Link from 'next/link';
import Logo from '../Logo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Github, Moon, SendHorizonal } from 'lucide-react';
import { siteConfig } from '@config/site';

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
                            <ul
                                key={component.title}
                                className=" text-muted-foreground flex flex-col gap-4"
                            >
                                <span className="font-bold text-primary text-lg">{component.title}</span>
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
                        ))}
                    </div>

                    <div className="min-w-fit">
                        <Label
                            htmlFor="newsletter"
                            className="font-semibold text-primary text-lg"
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
                        <Github />
                        <Moon />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
