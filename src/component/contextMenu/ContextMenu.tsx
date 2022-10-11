import {MenuOption, Position} from "../../utils/interface";
import styles from "./ContextMenu.module.scss";

interface Props {
    options: MenuOption[],
    position: Position,
    isShow: boolean,
    contact: number,
}

export const ContextMenu = (props: Props) => {
    const { options, position, isShow, contact } = props;
    const style = { // 控制菜单显示位置
        left: position.x,
        top: position.y,
        display: isShow ? "block" : "none",
    }

    return <ul className={styles["container"]} style={style}>
        {options.map(option => <li
            key={option.key}
            onClick={() => option.onClick(contact)}>
            {option.name}
        </li>)}
    </ul>

}