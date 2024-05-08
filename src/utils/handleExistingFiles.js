import uuid from "react-uuid";

export const handleExistingFiles = (purchase) => {
    const existingFiles = [{ id: uuid(), file: purchase?.bill, name: purchase?.bill?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill2, name: purchase?.bill2?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill3, name: purchase?.bill3?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill4, name: purchase?.bill4?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill5, name: purchase?.bill5?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill6, name: purchase?.bill6?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill7, name: purchase?.bill7?.split('/').pop(), type: 'existing' },
    ].filter(purchase => purchase.file && purchase.file !== null);

    return existingFiles
}