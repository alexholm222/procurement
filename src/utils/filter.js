export const handleFilter = (query, list) => {
    const result = list.filter(el => el.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    return result;
}

export const handleFilterVendor = (query, list) => {
    const result = list.filter(el => el.name.concat(el.inn).toLowerCase().indexOf(query.toLowerCase()) !== -1);
    return result;
}

export const handleFilterObject = (query, list) => {
    const result = list.filter(el => el.name.concat(el.inn).concat(el.kpp).toLowerCase().indexOf(query.toLowerCase()) !== -1);
    return result;
}
