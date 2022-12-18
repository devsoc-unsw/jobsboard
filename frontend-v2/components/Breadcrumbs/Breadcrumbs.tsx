"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'

const Breadcrumbs = () => {
  const router = useRouter();
  const pathname = usePathname()

  // ref: https://dev.to/dan_starner/building-dynamic-breadcrumbs-in-nextjs-17oa
  const generateBreadcrumbs = () => {
    if (!pathname) return []
    // Break down the path between "/"s, removing empty entities
    // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = pathname.split("/")
                                                 .filter(v => v.length > 0);

    // Iterate over the list of nested route parts and build
    // a "crumb" object for each one.
    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      // We can get the partial nested route for the crumb
      // by joining together the path parts up to this point.
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      // The title will just be the route string for now
      const title = subpath.length ? subpath[0].toUpperCase() + subpath.slice(1) : subpath;
      return { href, title }; 
    })

    // Add in a default "Home" crumb for the top-level
    return [{ href: "/", title: "Home" }, ...crumbList];
  }

  const breadcrumbList = generateBreadcrumbs();

  return (
    <ul className='flex justify-start ml-[28%] mt-10 mb-4 p-0 list-none font-bold'>
      {breadcrumbList.map((breadcrumb, idx) => 
      <li
        // class='flex float-left h-5 w-auto items-center'
        // class='{ "text-jb-placeholder font-bold cursor-pointer text-base duration-200 ease-linear hover:text-jb-textlink-hovered": breadcrumb.link }'
      key={idx} onClick={() => router.push(breadcrumbList[idx].href)}>
        {breadcrumb.title === 'Home' ? <div><FontAwesomeIcon width={16} icon='house' /></div> : <p
          // className='{ "text-jb-headings text-base font-bold": !breadcrumb.link,
          //           "text-jb-placeholder font-bold cursor-pointer text-base duration-200 ease-linear hover:text-jb-textlink-hovered ": breadcrumb.link }'
        >
          {breadcrumb.title}
        </p>}
      </li>)}
    </ul>
  )
}

export default Breadcrumbs