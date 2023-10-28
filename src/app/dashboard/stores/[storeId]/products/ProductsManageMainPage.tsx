'use client';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '../../../../../components/DateRangePicker';
import { Products } from '@types';
import { DataTable } from '../../../../../components/data-table/DataTable';
import { columns } from '../../../../../components/data-table/Columns';

type ProductsManageMainPageProps = {
    products: Products['Row'][];
    // products: Products['Row'][] | null;
};

const ProductsManageMainPage = ({ products: data }: ProductsManageMainPageProps) => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Products</h1>
                <DateRangePicker
                    date={date}
                    setDate={setDate}
                />
            </div>

            <main className="mx-auto py-2">
                <DataTable
                    data={data}
                    columns={columns}
                />
            </main>
        </>
    );
};

export default ProductsManageMainPage;
