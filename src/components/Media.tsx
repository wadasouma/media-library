import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { handleAddRecord,handleGetRecords,deleteRecord, updateRecord } from "./db";
type NewDatas={
    title:string;
    tags:string[];
    modelNumber:string;
    url:string;
    imgFile:File;
}
type SavedDatas=NewDatas & {
    id:number;
}
type MediaFormProps={
    onSubmit:(datas:NewDatas)=>Promise<void>;
    initialDatas?:SavedDatas;
}
type HomeProps={
    title:string
    basePath:string
}
function MediaHome({title,basePath}:HomeProps){
    const navigate=useNavigate();
    return(
        <div className="mediaHome">
            <h1>{title}</h1>
            <div className="homeNavButtonDiv">
                <button onClick={()=>navigate(`/${basePath}/record`)}>記録する</button>
                <button onClick={()=>navigate(`/${basePath}/view`)}>探す</button>
            </div>
        </div>
    )
}
function MediaForm({onSubmit,initialDatas}:MediaFormProps){
    const [title,setTitle]=useState(initialDatas?.title ?? "");
    const [tags,setTags]=useState<string[]>(initialDatas?.tags ?? [""]);
    const [modelNumber,setModelNumber]=useState(initialDatas?.modelNumber ?? "");
    const [url,setUrl]=useState(initialDatas?.url ?? "");
    const [imgFile,setImgFile]=useState<File|null>(initialDatas?.imgFile ?? null);
    function handleSetTag(index:number,value:string){
        setTags((prev)=>{
            return prev.map((tag,i)=>{
               return index===i ? value : tag;
            })
        });
    }
    function addTagInput(){
        setTags((prev)=>[...prev,""])
    }
    function removeTagInput(index:number){
        setTags((prev)=>prev.filter((_,i)=>i !==index));
    }
    function handleSubmit(){
        const createdDatas=createDats();
        if(createdDatas===null)return;
        onSubmit(createdDatas);
    }
    function createDats():NewDatas|null{
        if(imgFile===null){alert("画像を添付してください"); return null;}
        const createdDatas={
            title,
            tags,
            modelNumber,
            url,
            imgFile
        };
        return createdDatas;
    }
    return(
        <div className="mediaFormDiv">
            <label>タイトル：
                <input 
                type="text" 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)}
                placeholder="タイトルを入力"  
                />
            </label>
            <div>
                {tags.map((tag,index)=>(
                    <div key={index}>
                        <label>タグ：
                            <input
                            type="text" 
                            value={tag}
                            onChange={(e)=>{handleSetTag(index,e.target.value)}}
                            placeholder="タグを入力"
                            />
                        </label>
                        <button onClick={()=>removeTagInput(index)}>削除</button>
                    </div>
                ))}
                <button onClick={addTagInput}>タグを追加</button>
            </div>
            <label>型番：
                <input 
                type="text"
                value={modelNumber}
                onChange={(e)=>setModelNumber(e.target.value)}
                placeholder="型番を入力"
                />
            </label>
            <label>URL：
                <input 
                type="text"
                value={url}
                onChange={(e)=>setUrl(e.target.value)}
                placeholder="URLを入力"
                />
            </label>
            <label>サムネイル：
                <input 
                type="file"
                onChange={(e)=>{
                const file=e.target.files?.[0] ?? null
                setImgFile(file);
                }}
                />
            </label>
            <button onClick={handleSubmit}>登録
            </button>
        </div>
    )
}
type RecordProps={
    title:string
    recordName:string
}
function MediaRecord({title,recordName}:RecordProps){
    async function handleSubmitDatas(datas:NewDatas){
        if(datas.imgFile===null){alert("画像を添付してください"); return;} 
        try{
            await handleAddRecord(datas,"yourChoiceDB",recordName);
            alert("登録が完了しました");
        }catch(error){
            alert("登録に失敗しました");
            console.log(error);
        }
    }

    return(
        <div className="mediaRecordDiv">
            <h1>{title}登録画面</h1>
            <MediaForm onSubmit={handleSubmitDatas} />
        </div>
    )
}

function MediaView({title,recordName}:RecordProps){
    const [gettedDatas,setGettedDatas]=useState<SavedDatas[]>([]);
    const [edittingDatas,setEdittingDatas]=useState<SavedDatas>();
    const [serchText,setSerchText]=useState("");
    async function getRecords(){
        const datas=await handleGetRecords<SavedDatas>("yourChoiceDB",recordName);
        setGettedDatas(datas);
    }

    useEffect(()=>{
        getRecords();
    },[]);
    
    async function handleDelete(dbName:string,recordName:string,id:number){
        await deleteRecord(dbName,recordName,id);
        getRecords();
    }
    function handleMountMediaForm(data:SavedDatas){
        setEdittingDatas(data);
    }
    async function handleUpdataRecord(datas:NewDatas){
        if(edittingDatas===undefined)return;
        await updateRecord(datas,edittingDatas.id,"yourChoiceDB",recordName);
        await getRecords();
        alert("更新完了");
    }
    const displayDatas=gettedDatas.filter((data)=>{
        return data.title.includes(serchText);
    });
    return(
        <div>
            <h1>{title}探す</h1>
            <label>タイトル検索：
                <input 
                type="text"
                value={serchText}
                onChange={(e)=>setSerchText(e.target.value)}
                />
            </label>
            {edittingDatas&&<MediaForm key={edittingDatas.id} onSubmit={handleUpdataRecord} initialDatas={edittingDatas} />}
            <div className="mediaView">
                {displayDatas.map((data)=>(
                    <div key={data.id} >
                        <img src={URL.createObjectURL(data.imgFile)} className="mediaPic"></img>
                        <p>タイトル：{data.title}</p>
                        {data.tags.map((tag,index)=>(
                            <p key={index}>{tag}</p>
                        ))}
                        <p>URL：{data.url}</p>
                        <p>型番：{data.modelNumber}</p>
                        <button onClick={()=>{handleDelete("yourChoiceDB",recordName,data.id)}}>削除</button>
                        <button onClick={()=>handleMountMediaForm(data)}>更新</button>
                    </div>                    
                ))}
            </div>
        </div>
    )
}
export {MediaHome,MediaRecord,MediaView};