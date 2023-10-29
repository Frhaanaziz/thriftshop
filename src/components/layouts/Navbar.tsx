'use client';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@lib/utils';
import { Shirt } from 'lucide-react';
import Link from 'next/link';
import { forwardRef } from 'react';
import Logo from '../Logo';
import { siteConfig } from '@config/site';

const components = siteConfig.mainNav;

const ListItem = forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = 'ListItem';

const Navbar = () => {
    return (
        <div className="hidden lg:flex items-center gap-5">
            <Link href="/">
                <Logo />
            </Link>

            <NavigationMenu>
                <NavigationMenuList>
                    {components.map((component, i) => {
                        if (i === 0)
                            return (
                                <NavigationMenuItem key={component.title}>
                                    <NavigationMenuTrigger>{component.title}</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                        href="/"
                                                    >
                                                        <Shirt className="h-6 w-6" />
                                                        <div className="mb-2 mt-4 text-lg font-medium">
                                                            {siteConfig.name}
                                                        </div>
                                                        <p className="text-base leading-snug text-muted-foreground">
                                                            {siteConfig.description}
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            {component.items.map((item) => (
                                                <ListItem
                                                    key={item.title}
                                                    href={item.href}
                                                    title={item.title}
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );

                        return (
                            <NavigationMenuItem key={component.title}>
                                <NavigationMenuTrigger className="capitalize">
                                    {component.title}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                        {component.items.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        );
                    })}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
};

export default Navbar;
