
//http://localhost:8000/images/default/document (2)-1-1772506295077.jpg
//http://localhost:3000/images?folder=default&name=document (2)-1-1772506295077.jpg

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search)
    const filename = searchParams.get("name")
    const folder = searchParams.get("folder")

    return await fetch(`${process.env.NEXT_PUBLIC_BE_REMOTE}/images/${folder}/${filename}`)
}