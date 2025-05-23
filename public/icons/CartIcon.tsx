import {SVGProps} from 'react'

export function CartIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
               color="#000000">
                <path d="m8 16l8.72-.727c2.729-.227 3.341-.823 3.643-3.544L21 6M6 6h16"></path>
                <circle cx="6" cy="20" r="2"></circle>
                <circle cx="17" cy="20" r="2"></circle>
                <path
	                d="M8 20h7M2 2h.966c.945 0 1.768.625 1.997 1.515L7.94 15.076a1.96 1.96 0 0 1-.35 1.686L6.631 18"></path>
            </g>
        </svg>
	)
}
