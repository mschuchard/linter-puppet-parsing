#missing colon: /foo
file { '/foo'
  ensure => file,
  mode   => '1777',
}

#missing comma: ensure
user { 'bar':
  ensure => present
  uid    => 006,
}

#attribute typo: esure
group { 'baz':
  esure => absent,
  gid   => 007,
}

#ensure compatible with linter-puppet-lint
exec { 'make me a pizza':
  command  => '/bin/mkpizza --great /oven',
  onlyif   => '/bin/ls /hungry',
}
