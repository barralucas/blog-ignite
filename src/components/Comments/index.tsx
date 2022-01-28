import { useEffect } from "react";

export function Comments() {
    useEffect(() => {
        let script = document.createElement("script");
        let anchor = document.getElementById("inject-comments-for-uterances");
        script.setAttribute("src", "https://utteranc.es/client.js");
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("async", "true");
        script.setAttribute("repo", "lucastrindadebarra/blog-ignite");
        script.setAttribute("issue-term", "title");
        script.setAttribute("label", "Comente aqui");
        script.setAttribute("theme", "github-dark");
        anchor.appendChild(script);
    }, []);

    return (
        <div id="inject-comments-for-uterances"></div>
    );
}