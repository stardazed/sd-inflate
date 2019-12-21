/**
 * gzip/common - common constants and tables
 * Part of Stardazed
 * (c) 2018-Present by Arthur Langereis - @zenmumbler
 * https://github.com/stardazed/sd-gzip
 *
 * inflate.js (c) 2013 by Gildas Lormeau, part of the zip.js library
 * Based on zlib (c) 1995-2017 Jean-loup Gailly and Mark Adler
 */

// tslint:disable:variable-name

import { ZStream } from "./zstream";

export const enum ZStatus {
	OK = 0,
	STREAM_END = 1,
	NEED_DICT = 2,
	STREAM_ERROR = -2,
	DATA_ERROR = -3,
	MEM_ERROR = -4,
	BUF_ERROR = -5,
}

export const enum ZFlush {
	NO_FLUSH = 0,
	PARTIAL_FLUSH = 1,
	FULL_FLUSH = 3,
	FINISH = 4
}

export const enum ZStrategy {
	DEFAULT_STRATEGY = 0,
	FILTERED = 1,
	HUFFMAN_ONLY = 2
}

export const enum ZLimits {
	MIN_BITS = 8,
	MAX_BITS = 15,
	MANY = 1400
}

export const inflate_mask = [
	0x00000000, 0x00000001, 0x00000003, 0x00000007,
	0x0000000f, 0x0000001f, 0x0000003f, 0x0000007f,
	0x000000ff, 0x000001ff, 0x000003ff, 0x000007ff,
	0x00000fff, 0x00001fff, 0x00003fff, 0x00007fff,
	0x0000ffff
];


export type InOut<T> = [T];

export type NumArray = Int32Array | number[];

export interface ZBuffer {
	bitk: number; // bits in bit buffer
	bitb: number; // bit buffer
	window: Uint8Array; // sliding window
	end: number; // one byte after sliding window
	read: number; // window read pointer
	write: number; // window write pointer

	inflate_flush(z: ZStream, r: ZStatus): ZStatus;
}

export interface ZDeflateHeap {
	heap: number[];
	heap_len: number;
	heap_max: number;
	opt_len: number;
	static_len: number;

	depth: number[];
	bl_count: number[];

	pqdownheap(tree: number[], k: number): void;
}

/**
 * Reverse the byte order of a 32-bit unsigned integer
 * @internal
 */
export const swap32 = (q: number) =>
	(((q >>> 24) & 0xff) | ((q >>> 8) & 0xff00) |
	((q & 0xff00) << 8) | ((q & 0xff) << 24)) >>> 0;

/**
 * Returns the appropriate Uin8Array view for any BufferSource
 * or undefined in case of failure.
 * @internal
 */
export function u8ArrayFromBufferSource(source: BufferSource): Uint8Array | undefined {
	if (source instanceof ArrayBuffer) {
		return new Uint8Array(source);
	}
	if (! ArrayBuffer.isView(source)) {
		return undefined;
	}
	if (! (source instanceof Uint8Array)) {
		return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
	}

	return source;
}
