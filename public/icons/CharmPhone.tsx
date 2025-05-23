import {SVGProps} from 'react'

export function CharmPhone(props: SVGProps<SVGSVGElement>) {
	const size = "13px"
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" {...props}>
            <path fill="none" stroke="#5b5f62" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M1.75 1.75c0 8.5 4 12.5 12.5 12.5v-4l-3.5-1l-1 1.5c-2 0-4.5-2.5-4.5-4.5l1.5-1l-1-3.5z"></path>
        </svg>
	)
}

