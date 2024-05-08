import s from './Vendors.module.scss';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as IconChewron } from '../../image/icon/purchase/iconChewron.svg';
//slice
import { purchaseSelector } from '../../store/reducer/purchase/selector';
//utils
import { handleFilter } from '../../utils/filter';
import { HandledateContract } from '../../utils/date';

const Vendors = ({ hiden, vendorId, contractVendorId, setVendorId, setContractVendorId, disabled }) => {
    const vendors = useSelector(purchaseSelector).vendors;
    const contracts = useSelector(purchaseSelector).vendorsContracts;
    const [vendor, setVendor] = useState({});
    const [vendorName, setVendorName] = useState('');
    const [lastVendor, setLastVendor] = useState({});
    const [openVendorsList, setOpenVendorsList] = useState(false);
    const [vendorsList, setVendorsList] = useState(vendors || []);
    const [openContractsList, setOpenContractsList] = useState(false);
    const [contractsList, setContractsList] = useState([]);
    const [contractNumber, setContractNumber] = useState('');
    const [contractEndDate, setContractEndDate] = useState('');
    const vendorsRef = useRef();
    const contractsRef = useRef();
    console.log(vendorId, contractVendorId)

    useEffect(() => {
        const vendor = vendors.find(el => el.id == vendorId);
        setVendor(vendor);
        setVendorName(vendor?.name)
    }, [vendorId])

    useEffect(() => {
        const contractVendor = contracts.find(el => el.id == contractVendorId);
        setContractNumber(contractVendor?.contract_number);
        setContractEndDate(contractVendor?.end_date)
    }, [contractVendorId])

    //Определяем список договоров поставщика
    useEffect(() => {
        const newList = contracts.filter(el => el.vendor_id == vendor?.id);
        setContractsList(newList);
    }, [vendor, vendorName]);



    const handleChangeVendorName = (e) => {
        const value = e.target.value;
        const newList = handleFilter(value, vendors);
        setVendorsList(newList);
        newList && value.length > 0 ? setLastVendor(newList?.[0]) : setLastVendor({});
        setVendorName(value);
        setVendor({});
        setContractVendorId(null)

        setOpenVendorsList(true);
    }

    const handleChoseVendor = (e) => {
        const id = e.currentTarget.id;
        const vendor = vendors.find(el => el.id == id);
        const firstContract = contracts.find(el => el.vendor_id == vendor?.id);
        firstContract ? setContractVendorId(firstContract.id) : setContractVendorId(null);
        setVendorId(vendor.id);
        setVendorName(vendor?.name);
        setOpenVendorsList(false);
    }

    const handleChoseContract = (e) => {
        const id = e.currentTarget.id;
        const contractsNew = contracts.find(el => el.id == id);
        setContractVendorId(id);
        setContractNumber(contractsNew.contract_number);
        setContractEndDate(contractsNew.end_date)
    }

    const handleFocusVendor = () => {
        setOpenVendorsList(true);
        setVendorsList(vendors)
    }

    /*  const handleBlurVendor = () => {
         vendor?.name ? setVendor(vendor) : setVendor(lastVendor);
         vendor?.name ? setVendorName(vendor?.name) : setVendorName(lastVendor?.name);
         const firstContract = contracts.find(el => el.vendor_id == lastVendor?.id);
         firstContract ? setContractVendorId(firstContract.id) : setContractVendorId(null);
     } */


    const closeModal = (e) => {
        e.stopPropagation()
        if (vendorsRef.current && !vendorsRef.current.contains(e.target) && !openContractsList) {
            setOpenVendorsList(false);

            return
        }

        if (contractsRef.current && !contractsRef.current.contains(e.target) && !openVendorsList) {
            setOpenContractsList(false)
            return
        }
    }

    const handleOpenContractsList = () => {
        openContractsList ? setOpenContractsList(false) : setOpenContractsList(true)
    }



    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, [openContractsList, openVendorsList]);

    return (
        <div className={`${s.vendor} ${hiden && s.vendor_hiden}`}>
            <div className={`${s.container} ${s.container_vendor}`}>
                <p className={s.sub}>Продавец</p>
                <div ref={vendorsRef} className={`${s.block} ${disabled && s.block_disabled}`}>
                    <input onFocus={handleFocusVendor} /* onBlur={handleBlurVendor} */ onChange={handleChangeVendorName} type='text' value={vendorName || ''}></input>
                    <div className={s.requisites}>
                        <p>ИНН: {vendor?.inn && vendor?.inn !== '' ? vendor?.inn : 'отсутсвует'}</p>
                        {vendor?.kpp && <p>КПП: {vendor?.kpp}</p>}
                    </div>

                    <ul className={`${s.list} ${openVendorsList && s.list_open}`}>
                        {vendorsList.map((el) => {
                            return <li onClick={handleChoseVendor} key={el.id} id={el.id}>
                                <p>{el.name}</p>
                                <div className={s.requisites}>
                                    <p>ИНН: {el?.inn && el?.inn !== '' ? el?.inn : 'отсутсвует'}</p>
                                    {el?.kpp && <p>КПП: {el?.kpp}</p>}
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>

            <div className={`${s.container} ${s.container_contract}`}>
                <p className={s.sub}>Номер договора</p>
                <div ref={contractsRef} onClick={handleOpenContractsList} className={`${s.block} ${disabled && s.block_disabled} ${contractsList.length <= 1 && s.block_dis}`}>
                    <div className={`${s.arrow} ${contractsList.length <= 1 && s.arrow_hiden}`}>
                        <IconChewron />
                    </div>
                    <p>{contractNumber}</p>
                    <div className={s.requisites}>
                        {contractNumber && <p>{contractEndDate == null ? 'бессрочный' : `действует до ${HandledateContract(contractEndDate)}`}</p>}
                        {!contractNumber && <p>Действущих договоров нет</p>}
                    </div>

                    <ul className={`${s.list} ${openContractsList && s.list_open}`}>
                        {contractsList.map((el) => {
                            return <li onClick={handleChoseContract} key={el.id} id={el.id}>
                                <p>{el.contract_number}</p>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default Vendors;