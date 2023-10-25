import { Search } from 'lucide-react';
import { Button } from './ui/button';

const SearchHeader = () => {
    return (
        <Button
            variant="ghost"
            className="border"
            size="icon"
        >
            <Search className="h-4 w-4" />
        </Button>
    );
};

export default SearchHeader;
