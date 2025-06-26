import { CodeXml, ExternalLink, Github } from "lucide-react";
import Link from "next/link";

type CardProps = {
  value:{
    name:string,
    description:string,
    githubLink:string,
    hosted:boolean,
    hostedLink?:string
  }
};

export default function Card(props:CardProps) {
  
    return (
        <div className="max-w-md w-[365px] md:h-95  min-h-sm max-h-5xl bg-slate-800 rounded-sm p-7 flex flex-col gap-y-5">
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
            </div>
    );
}