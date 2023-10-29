import { getUserAction } from '@app/_actions/user';
import NewStoreForm from '@components/forms/NewStoreForm';
import { notFound } from 'next/navigation';

const NewStorePage = async () => {
    const author_id = (await getUserAction()).data.user.id;
    if (!author_id) return notFound();

    return (
        <div>
            <h1 className="text-2xl font-bold">New Store</h1>
            <p className="text-muted-foreground my-1">Add new store to your account</p>

            <NewStoreForm author_id={author_id} />
        </div>
    );
};

export default NewStorePage;
