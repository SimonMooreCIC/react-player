import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { hot } from 'react-hot-loader'
import screenfull from 'screenfull'

import './reset.css'
import './defaults.css'
import './range.css'
import './App.css'

import { version } from '../../package.json'
import ReactPlayer from '../ReactPlayer'
import Duration from './Duration'

class App extends Component {
  state = {
    url: null,
    pip: false,
    playing: true,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false
  }
  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false
    })
  }
  playPause = () => {
    this.setState({ playing: !this.state.playing })
  }
  stop = () => {
    this.setState({ url: null, playing: false })
  }
  toggleControls = () => {
    const url = this.state.url
    this.setState({
      controls: !this.state.controls,
      url: null
    }, () => this.load(url))
  }
  toggleLight = () => {
    this.setState({ light: !this.state.light })
  }
  toggleLoop = () => {
    this.setState({ loop: !this.state.loop })
  }
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  toggleMuted = () => {
    this.setState({ muted: !this.state.muted })
  }
  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }
  togglePIP = () => {
    this.setState({ pip: !this.state.pip })
  }
  onPlay = () => {
    console.log('onPlay')
    this.setState({ playing: true })
  }
  onEnablePIP = () => {
    console.log('onEnablePIP')
    this.setState({ pip: true })
  }
  onDisablePIP = () => {
    console.log('onDisablePIP')
    this.setState({ pip: false })
  }
  onPause = () => {
    console.log('onPause')
    this.setState({ playing: false })
  }
  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }
  onProgress = state => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  onEnded = () => {
    console.log('onEnded')
    this.setState({ playing: this.state.loop })
  }
  onDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration })
  }
  onClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player))
  }
  renderLoadButton = (url, label) => {
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  }
  ref = player => {
    this.player = player
  }
  // onChooseFile = e => {
  // 	const url = URL.createObjectURL(e.target.files[0])
  //   this.setState({ url })
  //   console.log("Upload", url);
  // }
  onUseFile = () => {
    const blob = new Blob(["../videos/case.mp4"], {"type" : "video\/mp4"});
    const url = URL.createObjectURL(blob);
    console.log(url);
    this.setState({ url })

    // const file = new Blob(
    //     ["../videos/case.mp4"],
    //     {"type" : "video\/mp4"});
    // const url = URL.createObjectURL(file);

    // console.log(url);
    // this.setState({ url })

    // const link = '../videos/case.mp4';
    // const binaryData = [];
    // binaryData.push(link);
    // const url = window.URL.createObjectURL(new Blob(binaryData, {type: "video/mp4"}));
    // console.log(url);
    // this.setState({ url })
  }
  render () {
    const { url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, pip } = this.state
    const SEPARATOR = ' · '

    return (
      <div className='app'>
        <section className='section'>
          <h1>ReactPlayer Demo</h1>
          <div className='player-wrapper'>
            <ReactPlayer
              ref={this.ref}
              className='react-player'
              width='100%'
              height='100%'
              url={url}
              pip={pip}
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.onPlay}
              onEnablePIP={this.onEnablePIP}
              onDisablePIP={this.onDisablePIP}
              onPause={this.onPause}
              onBuffer={() => console.log('onBuffer')}
              onSeek={e => console.log('onSeek', e)}
              onEnded={this.onEnded}
              onError={e => console.log('onError', e)}
              onProgress={this.onProgress}
              onDuration={this.onDuration}
            />
          </div>

          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.stop}>Stop</button>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.onClickFullscreen}>Fullscreen</button>
                {ReactPlayer.canEnablePIP(url) &&
                  <button onClick={this.togglePIP}>{pip ? 'Disable PiP' : 'Enable PiP'}</button>
                }
              </td>
            </tr>
            <tr>
              <th>Speed</th>
              <td>
                <button onClick={this.setPlaybackRate} value={1}>1x</button>
                <button onClick={this.setPlaybackRate} value={1.5}>1.5x</button>
                <button onClick={this.setPlaybackRate} value={2}>2x</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='controls'>Controls</label>
              </th>
              <td>
                <input id='controls' type='checkbox' checked={controls} onChange={this.toggleControls} />
                <em>&nbsp; Requires player reload</em>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='muted'>Muted</label>
              </th>
              <td>
                <input id='muted' type='checkbox' checked={muted} onChange={this.toggleMuted} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='loop'>Loop</label>
              </th>
              <td>
                <input id='loop' type='checkbox' checked={loop} onChange={this.toggleLoop} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='light'>Light mode</label>
              </th>
              <td>
                <input id='light' type='checkbox' checked={light} onChange={this.toggleLight} />
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td><progress max={1} value={played} /></td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress max={1} value={loaded} /></td>
            </tr>
          </tbody></table>
        </section>
        <section className='section'>
          <table><tbody>
            <tr>
              <th>Video Files </th>
              <td>
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/video/case.mp4', 'mp4')}
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/video/big_buck_bunny_480p_h264.mov', 'mov')}
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/video/big_buck_bunny.ogv', 'ogv')}
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/video/big_buck_bunny.webm', 'webm')}
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/video/test.m4v', 'm4v')}
              </td>
            </tr>
            <tr>
              <td colspan="2">Supported Formats - (mp4, mov, ogv, webm, m4v)</td>
            </tr>
            <tr>
              <th>Audio Files</th>
              <td>
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/audio/sample.m4a', 'm4a')}
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/audio/sample.mpga', 'mpga')}
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/audio/the-wires.mp3', 'mp3')}
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/audio/sample.wav', 'wav')}
                {this.renderLoadButton('http://localhost:8081/videos?filePath=/Users/simonmoore/Documents/Mercury/OCWA/audio/sample.aac', 'aac')}
              </td>
            </tr>
            <tr>
              <td colspan="2">Supported Formats - (m4a, mp4a, mpga, mp2, mp2a, mp3, m2a, m3a, wav, weba, aac, oga, spx)</td>
            </tr>
          </tbody></table>

          <h2>State</h2>

          <table><tbody>
            <tr>
              <th>url</th>
              <td className={!url ? 'faded' : ''}>
                {(url instanceof Array ? 'Multiple' : url) || 'null'}
              </td>
            </tr>
            <tr>
              <th>playing</th>
              <td>{playing ? 'true' : 'false'}</td>
            </tr>
            <tr>
              <th>volume</th>
              <td>{volume.toFixed(3)}</td>
            </tr>
            <tr>
              <th>played</th>
              <td>{played.toFixed(3)}</td>
            </tr>
            <tr>
              <th>loaded</th>
              <td>{loaded.toFixed(3)}</td>
            </tr>
            <tr>
              <th>duration</th>
              <td><Duration seconds={duration} /></td>
            </tr>
            <tr>
              <th>elapsed</th>
              <td><Duration seconds={duration * played} /></td>
            </tr>
            <tr>
              <th>remaining</th>
              <td><Duration seconds={duration * (1 - played)} /></td>
            </tr>
          </tbody></table>
        </section>
        <div>
        {/* <input onChange={this.onChooseFile} type='file' /> */}
      </div>
        <footer className='footer'>
          Version <strong>{version}</strong>
          {SEPARATOR}
          <a href='https://github.com/CookPete/react-player'>GitHub</a>
          {SEPARATOR}
          <a href='https://www.npmjs.com/package/react-player'>npm</a>
        </footer>
      </div>
    )
  }
}

export default hot(module)(App)
