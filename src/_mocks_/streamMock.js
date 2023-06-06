export default {
  data: {
    _readableState: {
      objectMode: false,
      highWaterMark: 16384,
      buffer: {
        head: {
          data: new Uint8Array([
            // Mock data
          ]),
          next: null,
        },
        tail: {
          data: new Uint8Array([
            // Mock data
          ]),
          next: null,
        },
        length: 1,
      },
      length: 212,
      pipes: [],
      flowing: null,
      ended: false,
      endEmitted: false,
      reading: false,
      constructed: true,
      sync: true,
      needReadable: false,
      emittedReadable: false,
      readableListening: false,
      resumeScheduled: false,
      errorEmitted: false,
      emitClose: true,
      autoDestroy: true,
      destroyed: false,
      errored: null,
      closed: false,
    },
  },
};
