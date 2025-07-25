import { CodeXml, ExternalLink, Github } from "lucide-react";
import Link from "next/link";

type CardProps = {
  value:{
    name:string,
    description:string,
    githubLink:string,
    hosted:boolean,
    hostedLink?:string,
    techStack: Array<string>

  }
};

export default function Card(props:CardProps) {
  
    return (
        <div className="max-w-md w-[350px] md:h-xl  min-h-sm max-h-5xl bg-slate-800 rounded-sm px-7 py-10 flex flex-col gap-y-5">
              <div className="flex justify-between items-center ">
                <CodeXml className="text-emerald-600 font-extrabold size-10"/>
                <div className="flex items-center gap-x-5">
                <Link href={props.value.githubLink}><Github className="cursor-pointer"/></Link>
                {props.value.hosted && props.value.hostedLink && (
                  <Link href={props.value.hostedLink}>
                    <ExternalLink className="cursor-pointer"/>
                  </Link>
                )}
                </div>
              </div>
              <div className="text-2xl font-bold">{props.value.name}</div>
              <div>{props.value.description}</div>
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {/* <div className="text-sm bg-slate-600 p-2 rounded-full">reactjs</div>
                <div className="text-sm bg-slate-600 p-2 rounded-full">reactjs</div>
                <div className="text-sm bg-slate-600 p-2 rounded-full">reactjs</div> */}
              {props.value.techStack.map((i, key) => (
                <div key={key} className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30 hover:bg-emerald-500/30 hover:scale-110 transition-all duration-300">{i}</div>
              ))}
              </div>
            </div>
    );
}