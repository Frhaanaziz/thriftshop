'use client';
import { Menu, Shirt } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { siteConfig } from '@config/site';
import Link from 'next/link';
import { useState } from 'react';
import { ScrollArea } from '@components/ui/scroll-area';

const HeaderSheet = () => {
    const [isOpen, setIsOpen] = useState(false);
    const accordionDefaultValue = siteConfig.mainNav.map((_, i) => `item-${i}`);

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(v) => setIsOpen(v)}
        >
            <SheetTrigger
                aria-label="open navigation"
                className="lg:hidden"
            >
                <Menu />
            </SheetTrigger>

            <SheetContent
                side="left"
                className="px-0"
            >
                <SheetHeader className="px-6">
                    <SheetTitle>
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                        >
                            <Shirt className="inline mr-1 w-5 h-5" /> Thrift Shop
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-5/6">
                    <Accordion
                        type="multiple"
                        className="mt-6 px-6"
                        defaultValue={accordionDefaultValue}
                        // collapsible
                    >
                        {siteConfig.mainNav.map((component, i) => (
                            <AccordionItem
                                key={component.title}
                                value={`item-${i}`}
                            >
                                <AccordionTrigger className="capitalize">{component.title}</AccordionTrigger>

                                {component.items.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <AccordionContent className="text-muted-foreground hover:text-primary transition">
                                            {item.title}
                                        </AccordionContent>
                                    </Link>
                                ))}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default HeaderSheet;
