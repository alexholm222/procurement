import s from './ManualAccounting.module.scss';
import { useEffect, useRef, useState } from 'react';
//Api
import { getYears, getManualAcc } from '../../Api/Api';
//utils
import { setYearNow } from '../../utils/date';
import { handleFilterVendor } from '../../utils/filter';
//components
import Years from '../Years/Years';
import Search from '../Search/Search';
import ModalSuplier from '../ModalSupliers/ModalSuplier';
import Table from './Table/Table';


const ManualAccounting = ({ modalVendor, setModalVendor, manualFirstData, firstLoad }) => {
    const [years, setYears] = useState([setYearNow()] || []);
    const [selected, setSelected] = useState(years[0] || '');
    
    const [load, setLoad] = useState(false);
    const [vendors, setVendors] = useState(manualFirstData || []);
    const [vendorsSearch, setVendorsSearch] = useState([]);
    const [vendorId, setVendorId] = useState('');
    const [query, setQuery] = useState('');
    const [addType, setAddType] = useState('');
    const windowRef = useRef();

    useEffect(() => {
        getYears()
            .then(res => {
                const data = res.data.data;
                console.log(data)
                data.length > 0 && setYears(data)

            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        setLoad(true)
        !firstLoad && getManualAcc(selected)
            .then(res => {
                const data = res.data.data;
                setVendors(data)
                
                setLoad(false)
            })
            .catch(err => console.log(err))
    }, [selected, vendorId, firstLoad]);

    useEffect(() => {
        const result = handleFilterVendor(query, [...vendors])
        setVendorsSearch(result)
    }, [query])


    return (
        <div className={s.window} ref={windowRef}>
            <div className={s.header}>
                <Search query={query} setQuery={setQuery} />
                <Years years={years} selected={selected} setSelected={setSelected} />
            </div>
            <Table vendorId={vendorId} firstLoad={firstLoad} load={load} vendors={query.length == 0 ? vendors : vendorsSearch} year={selected}/>

            {modalVendor ? <ModalSuplier role={'director'} setModal={setModalVendor} setVendorId={setVendorId} setAddType={setAddType} windowRef={windowRef} scrollTopHeight={0} /> : ''}
        </div>
    );
};

export default ManualAccounting;