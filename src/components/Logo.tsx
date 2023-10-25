import { Shirt } from 'lucide-react';

const Logo = () => {
    return (
        <div className="flex gap-3 items-center">
            <Shirt className="inline w-5 h-5" />
            <span className="font-bold text-lg">Thriftshop</span>
        </div>
    );
};

export default Logo;
