'use client'
import parse from 'html-react-parser';
const NewsDetail = ({ content }: { content: any }) => {
    return (<>{parse(content)}</>)
}
export default NewsDetail