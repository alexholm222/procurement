import { useEffect, useRef, useState, memo } from 'react';
import s from './Table.module.scss';
//components 
import Cell from '../Cell/Cell';
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];



const Row = memo(({ data, vendorId, year, setVendorId }) => {
    return (
        <div className={s.row}>
            {data.map((el, index) => {
                return < Cell key={year + index} month={index + 1} year={year} data={el} vendorId={vendorId} setVendorId={setVendorId} />
            }
            )}
        </div>
    )
}
)

const Table = ({ vendors, year, firstLoad, load, vendorId }) => {
    const [anim, setAnim] = useState(false);
    const [mouseHook, setMouseHook] = useState(false);
    const [leftWidth, setLeftWidth] = useState(300);
    const tableRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            !firstLoad && setAnim(true)
        })
    }, [firstLoad])

    const handleMouseMove = (event) => {
        const x = event.clientX - 28;
        mouseHook && setLeftWidth(x)
    }

    const handleHookMouse = () => {
        setMouseHook(true)
    }

    const handleThrowMouse = () => {
        setMouseHook(false)
    }

    useEffect(() => {
        document.addEventListener('mouseup', handleThrowMouse)

        return () => {
            document.removeEventListener('mouseup', handleThrowMouse)
        }
    });


    const handleHorizontalScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.wheelDelta;
        tableRef.current.scrollLeft += delta > 0 ? 20 : -20;
    }

    const mouseMoveTable = () => {
        const isScrool = tableRef.current.scrollWidth > tableRef.current.clientWidth;

        if (isScrool && tableRef.current) {
            tableRef.current.addEventListener('wheel', handleHorizontalScroll)
        } else {
            tableRef.current.removeEventListener('wheel', handleHorizontalScroll)
        }
    }



    useEffect(() => {
        tableRef.current && tableRef.current.addEventListener('mousemove', mouseMoveTable)

        return () => {
            document.removeEventListener('mousemove', mouseMoveTable)
        }
    }, [tableRef]);



    return (
        <div onMouseMove={handleMouseMove} className={`${s.container} ${anim && s.container_anim} ${mouseHook && s.slide_grab}`}>

            <div style={{ width: `${leftWidth}px` }} className={s.left}>
                <div className={s.header}></div>

                {vendors.map(el => {
                    return <div key={el.id} id={el.id} className={`${s.vendor} ${el.id == vendorId && s.vendor_new}`}>
                        <p><span className={`${s.bage} ${el.id == vendorId && s.bage_vis}`}>Новый</span> {el.name}</p>
                        <div>
                            <span>ИНН {el.inn}</span>
                            <span >КПП {el.kpp}</span>
                        </div>

                    </div>
                })}

                <div className={`${s.slide} ${mouseHook && s.slide_active}`} onMouseDown={handleHookMouse}><div></div></div>
            </div>


            <div ref={tableRef} className={`${s.right} ${load && s.right_load}`}>
                <div className={s.header}>
                    {months.map((el, index) => {
                        return <div key={index + 1} className={s.cell}><p>{el}</p></div>
                    }
                    )}
                </div>

                {vendors.map(el => {
                    return <Row data={el.manual_accounting} vendorId={el.id} year={year} />
                })}

            </div>

        </div>
    )
}

export default Table;