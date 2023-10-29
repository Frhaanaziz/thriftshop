import { Menu, Shirt } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { siteConfig } from '@config/site';
import Link from 'next/link';

const HeaderSheet = () => {
    return (
        <Sheet>
            <SheetTrigger
                aria-label="open navigation"
                className="lg:hidden"
            >
                <Menu />
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>
                        <Link href="/">
                            <Shirt className="inline mr-1 w-5 h-5" /> Thrift Shop
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <Accordion
                    type="single"
                    className="mt-6 border-t"
                    collapsible
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
                                >
                                    <AccordionContent className="text-muted-foreground hover:text-primary transition">
                                        {item.title}
                                    </AccordionContent>
                                </Link>
                            ))}
                        </AccordionItem>
                    ))}
                </Accordion>
            </SheetContent>
        </Sheet>
    );
};

export default HeaderSheet;
