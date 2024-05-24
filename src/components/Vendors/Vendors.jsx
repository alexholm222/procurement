import s from './Vendors.module.scss';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as IconChewron } from '../../image/icon/purchase/iconChewron.svg';
import { ReactComponent as IconPlus } from '../../image/iconPlus.svg';
//slice
import { purchaseSelector } from '../../store/reducer/purchase/selector';
//utils
import { handleFilterVendor } from '../../utils/filter';
import { HandledateContract } from '../../utils/date';
//components
import ModalSuplier from '../ModalSupliers/ModalSuplier';
import ModalСontracts from '../ModalСontracts/ModalСontracts';
import VendorSceleton from './VendorSceleton/VendorSceleton';

const Vendors = ({ hiden, vendorId, contractVendorId, setVendorId, setContractVendorId, disabled, loadParametrs, windowRef }) => {
    const vendors = useSelector(purchaseSelector).vendors;
    const contracts = useSelector(purchaseSelector).vendorsContracts;
    const payers = useSelector(purchaseSelector).payers;
    const [vendor, setVendor] = useState({});
    const [vendorName, setVendorName] = useState('');
    const [lastVendor, setLastVendor] = useState({});
    const [openVendorsList, setOpenVendorsList] = useState(false);
    const [vendorsList, setVendorsList] = useState(vendors || []);
    const [openContractsList, setOpenContractsList] = useState(false);
    const [contractsList, setContractsList] = useState([]);
    const [contractNumber, setContractNumber] = useState('');
    const [contractEndDate, setContractEndDate] = useState('');
    const [modalVendor, setModalVendor] = useState(false);
    const [modalContracts, setModalContracts] = useState(false);
    const [addType, setAddType] = useState('');
    const [loadVendor, setLoadVendor] = useState(false);
    const [loadContract, setLoadContract] = useState(false);
    const vendorsRef = useRef();
    const contractsRef = useRef();

    useEffect(() => {
        const vendor = vendors.find(el => el.id == vendorId);
        console.log(vendor)
        setVendor(vendor);
        setVendorName(vendor?.name)
    }, [vendorId, vendors])

    useEffect(() => {
        const contractVendor = contracts.find(el => el.id == contractVendorId);
        setContractNumber(contractVendor?.contract_number);
        setContractEndDate(contractVendor?.end_date)
    }, [contractVendorId, contracts])

    //Определяем список договоров поставщика
    useEffect(() => {
        const newList = contracts.filter(el => el.vendor_id == vendor?.id);
        setContractsList(newList);

    }, [vendor, vendorName]);

    useEffect(() => {
        if (addType == 'vendor' && loadParametrs) {
            setLoadVendor(true);
            return
        }

        if (addType == 'contract' && loadParametrs) {
            setLoadContract(true);
            return
        }

        if (!loadParametrs) {
            setLoadVendor(false);
            setLoadContract(false);
            return
        }
    }, [addType, loadParametrs])


    const handleChangeVendorName = (e) => {
        const value = e.target.value;
        const newList = handleFilterVendor(value, vendors);
        setVendorsList(newList);
        newList && value.length > 0 ? setLastVendor(newList?.[0]) : setLastVendor({});
        setVendorName(value);
        setVendor({});
        setContractVendorId('')
        setVendorId('')
        setOpenVendorsList(true);
    }

    const handleChoseVendor = (e) => {
        const id = e.currentTarget.id;
        const vendor = vendors.find(el => el.id == id);
        const firstContract = contracts.find(el => el.vendor_id == vendor?.id);
       /*  firstContract ? setContractVendorId(firstContract.id) : setContractVendorId(''); */
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

    const handleOpenModalVendor = () => {
        setModalVendor(true)
    }

    const handleOpenModalContract = () => {
        setModalContracts(true)
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
                    {!loadVendor && <input onFocus={handleFocusVendor} /* onBlur={handleBlurVendor} */ onChange={handleChangeVendorName} type='text' value={vendorName || ''}></input>}
                    {!loadVendor && <div className={s.requisites}>
                        <p>ИНН: {vendor?.inn && vendor?.inn !== '' ? vendor?.inn : 'отсутсвует'}</p>
                        {vendor?.kpp && <p>КПП: {vendor?.kpp}</p>}
                    </div>
                    }
                    {<VendorSceleton loadVendor={loadVendor}/>}

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

           {/*  <div className={`${s.container} ${s.container_contract}`}>
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
            </div> */}

            <div className={s.buttons}>
                <button disabled={disabled} onClick={handleOpenModalVendor} className={`${s.button} ${disabled && s.button_disabled}`}>
                    <IconPlus />
                    <p>Добавить продавца</p>
                </button>

              {/*   <button disabled={disabled} onClick={handleOpenModalContract} className={`${s.button} ${disabled && s.button_disabled}`}>
                    <IconPlus />
                    <p>Добавить договор</p>
                </button> */}
            </div>
            {modalVendor ? <ModalSuplier setModal={setModalVendor} setVendorId={setVendorId} setContractVendorId={setContractVendorId} setAddType={setAddType} windowRef={windowRef}/> : ''}
            {modalContracts ? <ModalСontracts setModal={setModalContracts} vendors={vendors} setContractVendorId={setContractVendorId} setVendorId={setVendorId} payers={payers} setAddType={setAddType} windowRef={windowRef}/> : ''}
        </div>
    )
};

export default Vendors;