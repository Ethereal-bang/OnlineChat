import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import styles from "./Editor.module.scss";

interface Props {
    val: string,
    onChange: (val: string) => void,
}

export const Editor = (props: Props) => {

    const modules = {
        toolbar: {
            container: [
                [{ size: ["small", false, "large"] }],  // 字号
                ["bold", "underline", "italic"],
                [{ color: ['rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
                        'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
                        'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
                        'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
                        'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
                        'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
                        'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
                        'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
                        'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
                        'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
                        'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
                        'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)'] }],
            ],
        },
    }

    return <ReactQuill
        className={styles["container"]}
        value={props.val}
        onChange={value => props.onChange(value)}
        modules={modules}
    />

}